Apipie.configure do |config|
  config.app_name                = "AnnotateWithMe"
  config.copyright               = "copyright &copy; #{Date.today.year} AnnotateWithMe"
  config.default_version         = "v1.0"
  config.api_base_url            = ""
  config.doc_base_url            = "/apidocs"
  config.validate                = false
  config.reload_controllers      = Rails.env.development?
  config.api_controllers_matcher = File.join(Rails.root, "app", "controllers", "**","*.rb")
  config.api_routes              = Rails.application.routes
  config.show_all_examples       = true
  config.app_info                = "BASE URL: http://annotatewithme.r14.railsrumble.com/api/v1"
end
