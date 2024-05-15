module.exports = {
  apps : [{
    name: "cron-job-service",
    script: "npm",
    args: "run dev",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/home/ubuntu/ris/logs/cron-job-service.error.log",
    out_file: "/home/ubuntu/ris/logs/cron-job-service.log",
    combine_logs: true,
    time: true,

    // // MULTIPLE INSTANCES
    // instances: 3, // Número de instancias
    // exec_mode: "cluster", // Modo cluster para load balancing
    // env: {
    //   NODE_ENV: "development",
    // },
    // env_production: {
    //   NODE_ENV: "production",
    // },
  }]
}
