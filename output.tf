resource "local_file" "connect_data" {
  content = jsonencode({
    item_host = aws_db_instance.db.endpoint
    username  = aws_db_instance.db.username
    password  = aws_db_instance.db.password
  })

  filename = "connect_data.json"
}
