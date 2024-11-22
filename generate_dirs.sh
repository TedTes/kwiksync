#!/bin/bash

# Define modules and their directory structures
declare -A MODULES=(
  ["inventory-monitoring"]="src/controllers src/services src/models src/routes src/utils src/middlewares src/config tests/unit tests/integration"
    ["supplier-integration"]="src/controllers src/services src/models src/routes src/utils src/middlewares src/config tests/unit tests/integration"
      ["viral-product-alerts"]="src/controllers src/services src/models src/routes src/utils src/middlewares src/config tests/unit tests/integration"
)

# Function to create directories and root files
create_structure() {
	  MODULE_NAME=$1
	    DIRS=$2

	      echo "Creating module: $MODULE_NAME"
	        
	        # Create directories
		  for DIR in $DIRS; do
			      FULL_PATH="./$MODULE_NAME/$DIR"
			          mkdir -p "$FULL_PATH"
				      echo "  Created: $FULL_PATH"
				        done

					  # Create root files
					    ROOT_FILES=("package.json" "tsconfig.json" "README.md")
					      for FILE in "${ROOT_FILES[@]}"; do
						          FILE_PATH="./$MODULE_NAME/$FILE"
							      if [ ! -f "$FILE_PATH" ]; then
								            touch "$FILE_PATH"
									          echo "  Created file: $FILE_PATH"
										      fi
										        done
										}

									# Iterate over each module and create the structure
									for MODULE in "${!MODULES[@]}"; do
										  create_structure "$MODULE" "${MODULES[$MODULE]}"
									  done

									  echo "Directory generation completed!"

