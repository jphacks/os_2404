CREATE TABLE `users` (
  `id`        varchar(255) COLLATE utf8mb4_bin NOT NULL ,
  `name`      varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `img`       varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `auth_states` (
  `state` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'state',
  `redirect_url` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'OAuthが成功したときにリダイレクトするURL',
  UNIQUE KEY `state_state_uindex` (`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='OAuthに使う一時的なstate';

CREATE TABLE `login_sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `expiry` datetime NOT NULL COMMENT 'sessionの有効期限',
  PRIMARY KEY (`id`)
)ENGINE = InnoDB;

CREATE TABLE `discord_auths` (
  `user_id` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'ユーザID',
  `access_token` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'OAuth2のアクセストークン',
  `refresh_token` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'OAuth2のリフレッシュトークン',
  `expiry` datetime NOT NULL COMMENT 'アクセストークンの有効期限',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;