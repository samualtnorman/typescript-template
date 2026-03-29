let inherit (import <nixpkgs> {}) fetchFromGitHub mkShellNoCC cacert git; in

let fetchNixpkgs =
	{ rev, sha256 ? "" }: import (fetchFromGitHub { owner = "NixOS"; repo = "nixpkgs"; inherit rev sha256; }) {}; in

let inherit (fetchNixpkgs {
	rev = "1073dad219cb244572b74da2b20c7fe39cb3fa9e"; # unstable 2026/03/29
	sha256 = "tFwzTI0DdDzovdE9+Ras6CUss0yn8P9XV4Ja6RjA+nU=";
}) nodejs_24 pnpm_10; in

mkShellNoCC {
	packages = [
		cacert git nodejs_24
		(pnpm_10.override {
			nodejs = nodejs_24;
			version = "10.33.0";
			hash = "sha256-v8wby60nmxOlFsRGp1s8WLaQS0XVehlRQRAV5Qt1GoA=";
		})
	];
}
