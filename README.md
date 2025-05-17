# Development

## Dependencies

- Python3
- Node
- Docker
- Docker Compose
- VSCode or derivative IDE

## Setup

- Open project in IDE
- Install API dependencies with `cd api && python -m pip install -r requirements.txt`
- Install app dependencies with `cd app && npm install --save-dev`
- Install tileserver dependencies with `cd tiles && npm install --save-dev`
- `Ctrl + Shift + P > Run Tasks > Dev: Generate Tiles` to generate map vector tiles
    - This will take a long time and you can continue while it does, but the in-app map will not work properly until it completes
- `Ctrl + Shift + P > Run Tasks > Local: All` to start all services
- `Ctrl + Shift + P > Run Tasks > Dev: Reset Postgres Schema` to initialize the Postgres schema
- Visit http://localhost and begin implementation

## Deployment

- The app build with Preact / MapLibreGL JS in `./app`
    - Runs on host, accessed via proxy at `http://localhost`
    - Hot-reloaded
- The API built with FastAPI in `./api`
    - Runs on host, accessed via proxy at `http://localhost/api`
    - Hot-reloaded
- The tileserver built with TileServerGL in `./tiles`
    - Runs on host, accessed directly at `http://localhost:8080`
    - Vector only - doesn't support rasters
    - NOT hot-reloaded
- The Postgres (PostGIS) + PgAdmin + Nginx services run via Compose in `./infra/local`
    - PgAdmin accessed via proxy at `http://localhost/postgres`
        - Must be configured on first access but persists its config across runs
