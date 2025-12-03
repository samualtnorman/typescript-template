let inherit (import <nixpkgs> {}) fetchFromGitHub mkShellNoCC cacert git; in

let fetchNixpkgs =
	{ rev, sha256 ? "" }: import (fetchFromGitHub { owner = "NixOS"; repo = "nixpkgs"; inherit rev sha256; }) {}; in

let inherit (fetchNixpkgs {
	rev = "8bb5646e0bed5dbd3ab08c7a7cc15b75ab4e1d0f"; # 25.11 2025/12/03
	sha256 = "SqUuBFjhl/kpDiVaKLQBoD8TLD+/cTUzzgVFoaHrkqY=";
}) nodejs_24 pnpm_10; in

mkShellNoCC { packages = [ cacert git nodejs_24 (pnpm_10.override { nodejs = nodejs_24; }) ]; }
