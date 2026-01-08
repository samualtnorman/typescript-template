let inherit (import <nixpkgs> {}) fetchFromGitHub mkShellNoCC cacert git; in

let fetchNixpkgs =
	{ rev, sha256 ? "" }: import (fetchFromGitHub { owner = "NixOS"; repo = "nixpkgs"; inherit rev sha256; }) {}; in

let inherit (fetchNixpkgs {
	rev = "5912c1772a44e31bf1c63c0390b90501e5026886"; # unstable 2026/01/08
	sha256 = "Mj3d3PfwltLmukFal5i3fFt27L6NiKXdBezC1EBuZs4=";
}) nodejs_24 pnpm_10; in

mkShellNoCC {
	packages = [
		cacert git nodejs_24
		(pnpm_10.override {
			nodejs = nodejs_24;
			version = "10.27.0";
			hash = "sha256-08fD0S2H0XfjLwF0jVmU+yDNW+zxFnDuYFMMN0/+q7M=";
		})
	];
}
