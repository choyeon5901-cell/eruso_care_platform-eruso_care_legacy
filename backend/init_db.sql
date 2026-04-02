SELECT User, Host, plugin
FROM mysql.user
WHERE User IN ('root', 'telemed_user');