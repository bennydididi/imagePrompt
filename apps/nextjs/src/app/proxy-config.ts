// 配置全局代理
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
  // 设置全局代理环境变量
  process.env.GLOBAL_AGENT_HTTP_PROXY = process.env.HTTP_PROXY;
  process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env.HTTPS_PROXY;
  
  // 引入global-agent
  require('global-agent/bootstrap');
}
