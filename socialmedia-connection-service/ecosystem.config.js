module.exports = {
  apps : [{
    name: "socialmedia-connection-service",
    script: "npm",
    args: "run dev",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/home/ubuntu/ris/logs/socialmedia-connection-service.error.log",
    out_file: "/home/ubuntu/ris/logs/socialmedia-connection-service.log",
    combine_logs: true,
    time: true
  }]
}
