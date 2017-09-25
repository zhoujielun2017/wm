'use strict'

// const Client=require('./upyun/upyun');
const sign=require('./upyun/sign');
const Service=require('./upyun/service');


module.exports ={
  
  sign:sign,
  Bucket: Service,
  Service:Service
}
