CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'defiut23';
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'defiut23';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
