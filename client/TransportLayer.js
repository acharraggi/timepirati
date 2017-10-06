import appConfig from './awsconfig'
import AWS from 'aws-sdk'
AWS.config.region = appConfig.region

export class TransportLayer {
  // constructor (store) {
  //   this.store = store
  // }

  insertUser (rootStore) {
    const params = {
      TableName: 'TimePiratiUsers',
      // 'Item' contains the attributes of the item to be created
      // - 'userid': my userid
      // - 'projects': projectStore
      // - 'note': time log note
      // - 'createdAt': current Unix timestamp
      // note: these fields must be non-empty.
      Item: {
        userid: rootStore.userStore.userId,
        username: rootStore.userStore.userName,
        note: 'test 3',
        projects: rootStore.projectStore.asJson,
        createdAt: new Date().getTime()
      }
    }
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: appConfig.IdentityPoolId,
      Logins: {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_cYDmjMIFp': rootStore.userStore.getIdToken
      }
    })
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log('user inserted')
      }
    })
  }
}
