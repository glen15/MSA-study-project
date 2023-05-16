resource "local_file" "connect_data" {
  content = jsonencode({
    item_host    = aws_db_instance.shop_db.endpoint
    factory_host = aws_db_instance.factory_db.endpoint
    username     = aws_db_instance.shop_db.username
    password     = aws_db_instance.shop_db.password
  })

  filename = "connect_data.json"
}
