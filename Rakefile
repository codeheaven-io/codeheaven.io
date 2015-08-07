require 'yaml'

task :production do
  ensure_s3_website_is_installed 
  ensure_env_variables_present
  execute_jekyll_build 
  deploy_to_aws_s3
end

# Runs the command jekyll build
def execute_jekyll_build 
  puts 'Executing jekyll build'
  success = system('jekyll build')
  print_feedback_message 'Jekyll build ok!' if success
  raise 'Error while running jekyll build' unless success
end

# Deploy the site to S3 using s3_website
def deploy_to_aws_s3
  success = system('s3_website push')
  print_feedback_message 'Deploy successful to AWS S3!' if success
  raise 'Error deploying to AWS S3!' unless success
end

# Prints a feedback message, appending '-' before and after it
def print_feedback_message(message)
  dashes = "".rjust(message.size, '-')
  puts dashes, message, dashes
end

# Checks if s3_website is installed
def ensure_s3_website_is_installed
  begin 
    require 's3_website'
  rescue LoadError
    print_feedback_message "Please install s3_website with 'gem install s3_website'"
    raise
  end
end

def ensure_env_variables_present
  env = YAML.load_file('.env')
  raise %(Property 'S3_ID' not found in .env file. Please specify you AWS Access Key Id') unless env.key?('S3_ID') 
  raise %(Property 'S3_SECRET' not found in .env file. Please specify you AWS Access Key Secret') unless env.key?('S3_SECRET') 
end 