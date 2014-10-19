class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  skip_before_filter :verify_authenticity_token, :if => Proc.new { |c| c.request.format == 'application/json' }

  BASE_URL = 'http://annotatewithme.r14.railsrumble.com/'

  # CUSTOM EXCEPTION HANDLING
  rescue_from StandardError do |e|
    error(e)
  end

  def routing_error
    raise ActionController::RoutingError.new(params[:path])
  end

  protected

  def error(e)
    if env["ORIGINAL_FULLPATH"] =~ /^\/api/
      error_info = {
          :error => "internal-server-error",
          :exception => "#{e.class.name} : #{e.message}",
      }

      error_info[:trace] = e.backtrace[0, 10] if Rails.env.development?
      render :json => error_info.to_json, :status => 500
    else
      raise e
    end
  end
end
