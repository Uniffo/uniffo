# Script return latest release tag of empty string
# Required args:
# 1: tag name pattern

_TAG_LIST="$( git tag --list --sort="-v:refname" "${1}" )"
_LATEST_TAG="$( echo "${_TAG_LIST}" | head -n 1 )"

echo "${_LATEST_TAG}"