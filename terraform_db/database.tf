# shop database
resource "aws_db_instance" "shop_db" {
  allocated_storage    = 30
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "item"
  identifier           = "jh-shop-db"
  username             = var.db_user_name
  password             = var.db_password
  publicly_accessible  = true
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  tags = {
    Name = "jh-shop-db"
  }
}

# factory database
resource "aws_db_instance" "factory_db" {
  allocated_storage    = 30
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "log"
  identifier           = "jh-factory-db"
  username             = var.db_user_name
  password             = var.db_password
  publicly_accessible  = true
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  tags = {
    Name = "jh-factory-db"
  }
}

