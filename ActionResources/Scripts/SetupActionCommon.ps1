# Function to setup action common
function SetupActionCommon() {
	# Get ActionCommon root
	$root = git rev-parse --show-toplevel
	$actionCommonRoot = "$root\src\KaizalaAggregationService\ActionResources\ActionCommon"
	
	# Setup ActionCommon 
	$ErrorPreference = $ErrorActionPreference
	$ErrorActionPreference = "SilentlyContinue"
	"Setting up ActionCommon dependencies..."
	cd $actionCommonRoot
	yarn install --frozen-lockfile
	$ErrorActionPreference = $ErrorPreference
}

# Function to setup action SDK
function SetupActionSDK() {
	# Get ActionSDK root
	$root = git rev-parse --show-toplevel
	$actionSdkRoot = "$root\src\KaizalaAggregationService\ActionResources\ActionSDK"
	
	# Setup ActionSDK 
	$ErrorPreference = $ErrorActionPreference
	$ErrorActionPreference = "SilentlyContinue"
	"Setting up ActionSDK dependencies..."
	cd $actionSdkRoot
	yarn install --frozen-lockfile
	$ErrorActionPreference = $ErrorPreference
}