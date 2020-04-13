# Function to setup action packages
function SetupActionPackage() {
	# Get ActionResources root
	$root = git rev-parse --show-toplevel
	$actionResourcesRoot = "$root\src\KaizalaAggregationService\ActionResources"

	# Action package root
	$actionPackageBaseRoot = "$actionResourcesRoot\ActionPackages"
	
	# Setup shared 
	$ErrorPreference = $ErrorActionPreference
	$ErrorActionPreference = "SilentlyContinue"
	"Setting up Action dependencies..."
	cd $actionPackageBaseRoot
	yarn install --frozen-lockfile
	$ErrorActionPreference = $ErrorPreference
}

# Function to build action package
function BuildActionPackage([string] $PackageId, [switch] $WatchMode) {
	# Get ActionResources root
	$root = git rev-parse --show-toplevel
	$actionResourcesRoot = "$root\src\KaizalaAggregationService\ActionResources"
	$wwwroot = "$root\src\KaizalaAggregationService\KasWeb\wwwroot"
	
	# Action package root
	$actionPackageRoot = "$actionResourcesRoot\ActionPackages\$PackageId"
	$actionPackageOutputRoot = "$wwwroot\ActionPackages\$PackageId"
	
	# Remove Action package destination
	"Removing $PackageId destination..."
	Remove-Item $actionPackageOutputRoot -Recurse -ErrorAction SilentlyContinue
	
	# Build package
	cd $actionPackageRoot
	if ($WatchMode) {
		"Building $PackageId in watch mode..."
		Start-Process -FilePath "npm" -ArgumentList "start"
	} else {
		"Building $PackageId..."
		npm run build
	}
}
