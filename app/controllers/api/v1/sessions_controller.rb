class Api::V1::SessionsController < ApplicationController
  respond_to :json
  api :GET, "/sessions/new", "Generate new and unique URL"

  def new
    session = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless Session.exists?(unique_url)
        break Session.create(uniq_hash: unique_url)
      end
    end

    resp = {id: session.id, url: BASE_URL + session.uniq_hash}
    respond_with(resp)
  end

  api :DELETE, "/sessions/:id", "Destroy the URL"

  def destroy
    session = Session.find(params[:id])

    respond_with(session.try(:destroy))
  end
end
