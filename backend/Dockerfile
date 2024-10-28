FROM continuumio/miniconda3

WORKDIR /app

# Copy environment.yml file
COPY environment.yml .

# Create conda environment
RUN conda env create -f environment.yml

# Initialize conda in bash config files
RUN conda init bash

# Make RUN commands use the conda environmenta
SHELL ["conda", "run", "-n", "flask_app_dev_env", "/bin/bash", "-c"]

# Copy the rest of the application
COPY . .

EXPOSE 5001

# Run Flask application using the conda environment
CMD ["conda", "run", "--no-capture-output", "-n", "flask_app_dev_env", "flask", "run", "--host=0.0.0.0"]