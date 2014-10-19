class Api::V1::SessionsController < ApplicationController
  respond_to :json

  api :GET, "/sessions/:id", "Fetch a session by uniq_hash. Keep in mind that here `:id` will be considered as `uniq_hash`"

  def show
    session = Session.find_by_uniq_hash(params[:id])
    respond_with(session)
  end

  api :POST, "/sessions", "Generate new and unique URL (session)"
  param :img_src, String, "Direct Image URL for the session", :required => true

  def create
    session = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless Session.exists?(unique_url)
        break Session.create(uniq_hash: unique_url, img_src: params[:img_src])
      end
    end

    respond_with(session, :location => api_v1_sessions_url(session))
  end

  api :DELETE, "/sessions/:id", "Destroy the URL (session)"

  def destroy
    session = Session.find(params[:id])

    respond_with(session.try(:destroy))
  end

  api :GET, "/sessions/:id/transactions", "Fetch all updates associated with a session"
  param :after, Integer, "Unix epoch time i.e. '1413618126'. You will get updates that were happened after this time"
  param :filters, Array, "To fetch particular type of updates. Eg.: ['annotations'] (the only type that we are supporting currently)"

  def transactions
    filters = params[:filters] || []
    session = Session.find(params[:id])
    objects = []

    if session
      if filters.empty?
        objects = Annotation.find_all_updates_after(params[:after], session.id)
      else
        filters.each do |filter|
          objects += eval(filter.classify).find_all_updates_after(params[:after], session.id)
        end
      end

      objects = objects.map do |object|
        {:type => (object.is_deleted ? "Delete" : "Create/Update"), :object => object}
      end
    end

    respond_with(objects)
  end
end
