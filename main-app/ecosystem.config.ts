module.exports = {
  apps : [{
    name: "main-app",
    script: "npm",
    args: "run start",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/home/ubuntu/ris/logs/mainapp.erros.log",
    out_file: "/home/ubuntu/ris/logs/mainapp.log",
    combine_logs: true,
    time: true
  }]
}
