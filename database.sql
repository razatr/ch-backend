create TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  is_activated BOOLEAN,
  activation_link VARCHAR(255)
);

create TABLE tokens(
  id SERIAL PRIMARY KEY,
  refresh_token VARCHAR(255),
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id)
);