variable "name" {
  type = string
}

resource "aws_efs_file_system" "fs" {
  creation_token = var.name
  throughput_mode = "bursting"
}

resource "aws_efs_access_point" "fs" {
  file_system_id = aws_efs_file_system.fs.id

  posix_user {
    uid = 1000
    gid = 1000
  }

  root_directory {
    path = "/ecs"

    creation_info {
      owner_uid = 1000
      owner_gid = 1000
      permissions = "755"
    }
  }
}
