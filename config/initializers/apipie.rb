Apipie.configure do |config|
  config.app_name                = "AnnoteWithMe"
  config.copyright               = "copyright &copy; #{Date.today.year} AnnoteWithMe"
  config.default_version         = "v1.0"
  config.api_base_url            = ""
  config.doc_base_url            = "/apidocs"
  config.validate                = false
  # config.disqus_shortname        = "ScreenInn"
  config.reload_controllers      = Rails.env.development?
  config.api_controllers_matcher = File.join(Rails.root, "app", "controllers", "**","*.rb")
  config.api_routes              = Rails.application.routes
  config.show_all_examples       = true
  config.app_info                = "BASE URL: http://boiling-spire-5369.herokuapp.com/api/v1"
end
