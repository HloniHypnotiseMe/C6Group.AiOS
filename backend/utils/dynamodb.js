/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * DynamoDB Helper Utilities
 * 
 * @description Database operations and utilities for AWS DynamoDB
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand,
  BatchGetCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(client)

// Table names from environment variables
const TABLES = {
  MAIN: process.env.DYNAMO_TABLE || 'c6group-superaai-table',
  AGENTS: process.env.DYNAMO_TABLE_AGENTS || 'c6group-superaai-agents',
  ACTIVITIES: process.env.DYNAMO_TABLE_ACTIVITIES || 'c6group-superaai-activities',
  METRICS: process.env.DYNAMO_TABLE_METRICS || 'c6group-superaai-metrics'
}

/**
 * Generic DynamoDB operations
 */
export class DynamoService {
  
  /**
   * Get item by primary key
   */
  async getItem(tableName, key) {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key
      })
      
      const response = await docClient.send(command)
      return response.Item
    } catch (error) {
      console.error('DynamoDB getItem error:', error)
      throw error
    }
  }

  /**
   * Put item (create or replace)
   */
  async putItem(tableName, item) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: {
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
      
      await docClient.send(command)
      return item
    } catch (error) {
      console.error('DynamoDB putItem error:', error)
      throw error
    }
  }

  /**
   * Update item
   */
  async updateItem(tableName, key, updates, conditions = null) {
    try {
      const updateExpression = []
      const expressionAttributeNames = {}
      const expressionAttributeValues = {}
      
      // Build update expression
      Object.keys(updates).forEach((field, index) => {
        const nameKey = `#field${index}`
        const valueKey = `:val${index}`
        
        updateExpression.push(`${nameKey} = ${valueKey}`)
        expressionAttributeNames[nameKey] = field
        expressionAttributeValues[valueKey] = updates[field]
      })
      
      // Add updatedAt timestamp
      const updatedAtKey = `:updatedAt`
      updateExpression.push(`#updatedAt = ${updatedAtKey}`)
      expressionAttributeNames['#updatedAt'] = 'updatedAt'
      expressionAttributeValues[updatedAtKey] = new Date().toISOString()

      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: conditions,
        ReturnValues: 'ALL_NEW'
      })
      
      const response = await docClient.send(command)
      return response.Attributes
    } catch (error) {
      console.error('DynamoDB updateItem error:', error)
      throw error
    }
  }

  /**
   * Delete item
   */
  async deleteItem(tableName, key) {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
        ReturnValues: 'ALL_OLD'
      })
      
      const response = await docClient.send(command)
      return response.Attributes
    } catch (error) {
      console.error('DynamoDB deleteItem error:', error)
      throw error
    }
  }

  /**
   * Scan table (use sparingly)
   */
  async scanTable(tableName, filters = null, limit = null) {
    try {
      const params = {
        TableName: tableName
      }
      
      if (filters) {
        params.FilterExpression = filters.expression
        params.ExpressionAttributeNames = filters.names
        params.ExpressionAttributeValues = filters.values
      }
      
      if (limit) {
        params.Limit = limit
      }

      const command = new ScanCommand(params)
      const response = await docClient.send(command)
      return response.Items
    } catch (error) {
      console.error('DynamoDB scan error:', error)
      throw error
    }
  }

  /**
   * Query items by partition key
   */
  async queryItems(tableName, keyCondition, filters = null, limit = null) {
    try {
      const params = {
        TableName: tableName,
        KeyConditionExpression: keyCondition.expression,
        ExpressionAttributeNames: keyCondition.names,
        ExpressionAttributeValues: keyCondition.values
      }
      
      if (filters) {
        params.FilterExpression = filters.expression
        if (filters.names) {
          params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, ...filters.names }
        }
        if (filters.values) {
          params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ...filters.values }
        }
      }
      
      if (limit) {
        params.Limit = limit
      }

      const command = new QueryCommand(params)
      const response = await docClient.send(command)
      return response.Items
    } catch (error) {
      console.error('DynamoDB query error:', error)
      throw error
    }
  }

  /**
   * Batch get items
   */
  async batchGetItems(tableName, keys) {
    try {
      const command = new BatchGetCommand({
        RequestItems: {
          [tableName]: {
            Keys: keys
          }
        }
      })
      
      const response = await docClient.send(command)
      return response.Responses[tableName] || []
    } catch (error) {
      console.error('DynamoDB batchGet error:', error)
      throw error
    }
  }

  /**
   * Batch write items (put/delete)
   */
  async batchWriteItems(tableName, items) {
    try {
      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName]: items
        }
      })
      
      await docClient.send(command)
      return true
    } catch (error) {
      console.error('DynamoDB batchWrite error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dynamoService = new DynamoService()

// Export table names
export { TABLES }

// Convenience methods for specific tables
export const agentService = {
  getAgent: (agentId) => dynamoService.getItem(TABLES.AGENTS, { agentId }),
  saveAgent: (agent) => dynamoService.putItem(TABLES.AGENTS, agent),
  updateAgent: (agentId, updates) => dynamoService.updateItem(TABLES.AGENTS, { agentId }, updates),
  deleteAgent: (agentId) => dynamoService.deleteItem(TABLES.AGENTS, { agentId }),
  getAllAgents: () => dynamoService.scanTable(TABLES.AGENTS)
}

export const activityService = {
  getActivity: (activityId) => dynamoService.getItem(TABLES.ACTIVITIES, { activityId }),
  saveActivity: (activity) => dynamoService.putItem(TABLES.ACTIVITIES, activity),
  getRecentActivities: (limit = 50) => dynamoService.scanTable(TABLES.ACTIVITIES, null, limit),
  getActivitiesByAgent: (agentId) => dynamoService.queryItems(
    TABLES.ACTIVITIES,
    {
      expression: 'agentId = :agentId',
      names: {},
      values: { ':agentId': agentId }
    }
  )
}

export const metricsService = {
  getMetrics: (metricId) => dynamoService.getItem(TABLES.METRICS, { metricId }),
  saveMetrics: (metrics) => dynamoService.putItem(TABLES.METRICS, metrics),
  getMetricsByAgent: (agentId, timeRange = '24h') => dynamoService.queryItems(
    TABLES.METRICS,
    {
      expression: 'agentId = :agentId',
      names: {},
      values: { ':agentId': agentId }
    }
  )
}