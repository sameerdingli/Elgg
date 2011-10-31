Installation: Requirements
==========================
*	MySQL 5 or greater
*	PHP 5.2 or greater with the following extensions:
	*	GD (for graphics processing: user and group profile icons plus many plugins)
	*	[http://www.php.net/mbstring Multibyte String support] (for internationalisation)
	*	Proper configuration and ability to send email through an MTA
*	Web server with support for URL rewriting

Official support is provided for the following configuration:
*	Apache (with the [http://httpd.apache.org/docs/2.0/mod/mod_rewrite.html rewrite module] enabled)
*	PHP running as an Apache module (safe mode and register globals should be off)

By "official support", we mean that most development and testing is performed with this configuration and much of the 
installation documentation is written assuming Apache is used. Priority on bug reports is also given to Apache users 
if the bug is web server specific (but those are rare). Other possible configurations include PHP running in CGI/FastCGI
mode with Apache and using the web servers [[Elgg and lighttpd|lighttpd]], [[Elgg and nginx|nginx]], or
[[Elgg and IIS|IIS]]. Elgg should generally work with these web servers but this requires additional configuration 
such as porting the rewrite rules.