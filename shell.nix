let inherit (import <nixpkgs> {}) fetchFromGitHub mkShellNoCC cacert git; in

let fetchNixpkgs =
	{ rev, sha256 ? "" }: import (fetchFromGitHub { owner = "NixOS"; repo = "nixpkgs"; inherit rev sha256; }) {}; in

let inherit (fetchNixpkgs {
	rev = "26d499fc9f1d567283d5d56fcf367edd815dba1d"; # 24.11 2025/04/17
	sha256 = "FHlSkNqFmPxPJvy+6fNLaNeWnF1lZSgqVCl/eWaJRc4=";
}) nodejs_22 pnpm_10; in

mkShellNoCC { packages = [ cacert git nodejs_22 pnpm_10 ]; }
