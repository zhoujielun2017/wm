const md5=require('md5');
function Service(serviceName, operatorName = '', password = '') {
    // NOTE bucketName will be removed
    this.bucketName = serviceName
    this.serviceName = this.bucketName
    this.operatorName = operatorName
    this.password = md5(password)
  }
module.exports=Service;
