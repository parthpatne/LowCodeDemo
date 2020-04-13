# Function to setup action hosts
function SetupActionHost() {
	# Get ActionHost root
	$root = git rev-parse --show-toplevel
	$actionHostRoot = "$root\src\KaizalaAggregationService\ActionResources\ActionHost"
	
	# Setup shared 
	$ErrorPreference = $ErrorActionPreference
	$ErrorActionPreference = "SilentlyContinue"
	cd $actionHostRoot
	"Installing ActionHost dependencies..."
	yarn install --frozen-lockfile
	$ErrorActionPreference = $ErrorPreference
}

# Function to build action hosts
function BuildActionHost([switch] $WatchMode) {
	# Get ActionHost root
	$root = git rev-parse --show-toplevel
	$actionHostRoot = "$root\src\KaizalaAggregationService\ActionResources\ActionHost"
	$actionHostOutputRoot = "$root\src\KaizalaAggregationService\KasWeb\wwwroot\ActionHost"
	
	# Remove ActionHost destination
	"Removing ActionHost destination..."
	Remove-Item $actionHostOutputRoot -Recurse -ErrorAction SilentlyContinue

	# Build all ActionHosts
	cd $actionHostRoot
	if ($WatchMode) {
		"Building ActionHost in watch mode..."
		Start-Process -FilePath "npm" -ArgumentList "start"
	} else {
		"Building ActionHost..."
		npm run build
	}
}