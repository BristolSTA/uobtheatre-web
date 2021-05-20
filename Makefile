database-clear:
		docker container rm -f uobtheatre-web_devcontainer_postgres_1
		docker volume rm -f uobtheatre-web_devcontainer_postgres_data