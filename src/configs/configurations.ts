import {IRepositoryConfig,IServerConfig} from "./interfaces"

 export default class Configurations {
    
     public static get Repository():IRepositoryConfig 
     { 
         return {
             connectionString: "mongodb://localhost/magicquill"
         }
     }
     
     public static get Server():IServerConfig 
     { 
         return {
             port: 3000
         }
     }
}

