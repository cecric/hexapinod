# The repositories

Its aim is to be loaded by the repositories service from hexapinod module in core.
All the file names should end by .repo.ts to be loaded automatically and implement IRepository or a sub interface of IRepository.

You can set the environment variable **SERVICE_REPOSITORY_FOLDERS** with the subfolder. If you set it with ``test`` for example, it will load the repositories from the subfolder ``./test`` wich return JSON instead of perform request on the database in our example.