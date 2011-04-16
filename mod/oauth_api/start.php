<?php
/**
 * OAuth libs
 *
 * @todo Pull these out into an elgg_oauth lib and use elgg_register_library().
 * @package oauth_api
 */

// require all vendor libraries
$plugin_path = dirname(__FILE__) . '/vendors/oauth/library';
elgg_register_class('OAuthDiscovery', "$plugin_path/OAuthDiscovery.php");
elgg_register_class('OAuthRequest', "$plugin_path/OAuthRequest.php");
elgg_register_class('OAuthRequester', "$plugin_path/OAuthRequester.php");
elgg_register_class('OAuthRequestVerifier', "$plugin_path/OAuthRequestVerifier.php");
elgg_register_class('OAuthServer', "$plugin_path/OAuthServer.php");

elgg_register_class('OAuthBodyMultipartFormdata', "$plugin_path/body/OAuthBodyMultipartFormdata.php");
elgg_register_class('OAuthStoreAbstract', "$plugin_path/store/OAuthStoreAbstract.class.php");

elgg_register_class('OAuthSignatureMethod_HMAC_SHA1', "$plugin_path/signature_method/OAuthSignatureMethod_HMAC_SHA1.php");
elgg_register_class('OAuthSignatureMethod_MD5', "$plugin_path/signature_method/OAuthSignatureMethod_MD5.php");
elgg_register_class('OAuthSignatureMethod_PLAINTEXT', "$plugin_path/signature_method/OAuthSignatureMethod_PLAINTEXT.php");
elgg_register_class('OAuthSignatureMethod_RSA_SHA1', "$plugin_path/signature_method/OAuthSignatureMethod_RSA_SHA1.php");
