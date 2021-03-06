const hmacsha1=require('hmacsha1');
const base64=require('base-64');
const pkg=require('../package.json');
const md5=require('md5');

/**
 * generate head sign
 * @param {object} service
 * @param {string} path - storage path on upyun server, e.g: /your/dir/example.txt
 * @param {string} contentMd5 - md5 of the file that will be uploaded
 */
 function getHeaderSign (service, method, path, contentMd5 = null) {
  const date = new Date().toGMTString()
  path = '/' + service.serviceName + path
  const sign = genSign(service, {
    method,
    path,
    date,
    contentMd5
  })
  return {
    'Authorization': sign,
    'X-Date': date,
  }
}

/**
 * generate signature string which can be used in head sign or body sign
 * @param {object} service
 * @param {object} options - must include key is method, path
 */
 function genSign (service, options) {
  const {method, path} = options

  const data = [
    method,
    encodeURI(path)
  ];

  // optional params
  ['date', 'policy', 'contentMd5'].forEach(item => {
    if (options[item]) {
      data.push(options[item])
    }
  })

  // hmacsha1 return base64 encoded string
  const sign = hmacsha1(service.password, data.join('&'))
  return `UPYUN ${service.operatorName}:${sign}`
}

/**
 * get policy and authorization for form api
 * @param {object} service
 * @param {object} - other optional params @see http://docs.upyun.com/api/form_api/#_2
 */
 function getPolicyAndAuthorization (service, params) {
  params['service'] = service.serviceName
  if (typeof params['save-key'] === 'undefined') {
    throw new Error('upyun - calclate body sign need save-key')
  }

  if (typeof params['expiration'] === 'undefined') {
    // default 30 minutes
    params['expiration'] = parseInt(new Date() / 1000 + 30 * 60, 10)
  }

  const policy = base64.encode(JSON.stringify(params))
  const authorization = genSign(service, {
    method: 'POST',
    path: '/' + service.serviceName,
    policy
  })
  return {
    policy,
    authorization
  }
}

 function getPurgeHeaderSign (service, urls) {
  const date = new Date().toGMTString()
  const str = urls.join('\n')
  const sign = md5(`${str}&${service.serviceName}&${date}&${service.password}`)

  return {
    'Authorization': `UpYun ${service.serviceName}:${service.operatorName}:${sign}`,
    'Date': date,
    'User-Agent': 'Js-Sdk/' + pkg.version
  }
}

module.exports = {
  genSign,
  getHeaderSign,
  getPolicyAndAuthorization,
  getPurgeHeaderSign
}
