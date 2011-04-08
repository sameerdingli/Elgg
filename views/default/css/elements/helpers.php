<?php
/**
 * Helpers CSS
 *
 * Contains generic elements that can be used throughout the site.
 *
 * @package Elgg.Core
 * @subpackage UI
 */
?>

.clearfloat { 
	clear: both;
}

.clearfix:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden;
}

.hidden {
	display: none;
}

.centered {
	margin: 0 auto;
}

.center {
	text-align: center;
}

.float {
	float: left;
}

.float-alt {
	float: right;
}

.right {
	float: right;
}

.left {
	float: left;
}

.link {
	cursor: pointer;
}

<?php @todo // do we need something like large and small? ?>
.large {
	font-size: 120%;
}

.small {
	font-size: 80%;
}

.elgg-discover .elgg-discoverable {
	display: none;
}

.elgg-discover:hover .elgg-discoverable {
	display: block;
}

/* ***************************************
	Spacing (from OOCSS)
*************************************** */
<?php
/**
 * Spacing classes
 * Should be used to modify the default spacing between objects (not between nodes of the same object)
 * Please use judiciously. You want to be using defaults most of the time, these are exceptions!
 * <type><location><size>
 * <type>: m = margin, p = padding
 * <location>: a = all, t = top, r = right, b = bottom, l = left, h = horizontal, v = vertical
 * <size>: n = none, s = small, m = medium, l = large
 */

$none = '0';
$small = '5px';
$medium = '10px';
$large = '20px';

echo <<<CSS
/* Padding */
.pan{padding:$none}
.prn, .phn{padding-right:$none}
.pln, .phn{padding-left:$none}
.ptn, .pvn{padding-top:$none}
.pbn, .pvn{padding-bottom:$none}

.pas{padding:$small}
.prs, .phs{padding-right:$small}
.pls, .phs{padding-left:$small}
.pts, .pvs{padding-top:$small}
.pbs, .pvs{padding-bottom:$small}

.pam{padding:$medium}
.prm, .phm{padding-right:$medium}
.plm, .phm{padding-left:$medium}
.ptm, .pvm{padding-top:$medium}
.pbm, .pvm{padding-bottom:$medium}

.pal{padding:$large}
.prl, .phl{padding-right:$large}
.pll, .phl{padding-left:$large}
.ptl, .pvl{padding-top:$large}
.pbl, .pvl{padding-bottom:$large}

/* Margin */
.man{margin:$none}
.mrn, .mhn{margin-right:$none}
.mln, .mhn{margin-left:$none}
.mtn, .mvn{margin-top:$none}
.mbn, .mvn{margin-bottom:$none}

.mas{margin:$small}
.mrs, .mhs{margin-right:$small}
.mls, .mhs{margin-left:$small}
.mts, .mvs{margin-top:$small}
.mbs, .mvs{margin-bottom:$small}

.mam{margin:$medium}
.mrm, .mhm{margin-right:$medium}
.mlm, .mhm{margin-left:$medium}
.mtm, .mvm{margin-top:$medium}
.mbm, .mvm{margin-bottom:$medium}

.mal{margin:$large}
.mrl, .mhl{margin-right:$large}
.mll, .mhl{margin-left:$large}
.mtl, .mvl{margin-top:$large}
.mbl, .mvl{margin-bottom:$large}
CSS;
?>