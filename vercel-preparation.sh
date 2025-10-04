# move into the folder of this script
cd "$(dirname "$0")" || exit 1

mkdir --parents backend/.vercel/output/functions/api.func/
cp --recursive backend/* backend/.vercel/output/functions/api.func/
cp --recursive backend/.vercel/output/functions/api.func/_dot_vercel_copy/output/ backend/.vercel/
cp --recursive backend frontend/frontend/src/backend/