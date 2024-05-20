module.exports = {
  apps: [
    {
      name: "content-upload-service-1",
      script: "npm",
      args: "run dev",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/home/ubuntu/ris/logs/content-upload-service-1.error.log",
      out_file: "/home/ubuntu/ris/logs/content-upload-service-1.log",
      combine_logs: true,
      time: true,
      env: {
        PORT: 3003
      }
    },
    {
      name: "content-upload-service-2",
      script: "npm",
      args: "run dev",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/home/ubuntu/ris/logs/content-upload-service-2.error.log",
      out_file: "/home/ubuntu/ris/logs/content-upload-service-2.log",
      combine_logs: true,
      time: true,
      env: {
        PORT: 3004
      }
    },
    {
      name: "content-upload-service-3",
      script: "npm",
      args: "run dev",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/home/ubuntu/ris/logs/content-upload-service-3.error.log",
      out_file: "/home/ubuntu/ris/logs/content-upload-service-3.log",
      combine_logs: true,
      time: true,
      env: {
        PORT: 3005
      }
    }
  ]
}
