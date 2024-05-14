module.exports = {
  apps : [{
    name: "content-upload-service",
    script: "npm",
    args: "run dev",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/home/ubuntu/ris/logs/content-upload-service.error.log",
    out_file: "/home/ubuntu/ris/logs/content-upload-service.log",
    combine_logs: true,
    time: true
  }]
}
