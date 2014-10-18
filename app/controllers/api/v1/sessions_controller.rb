class Api::V1::SessionsController < ApplicationController
  respond_to :json

  api :POST, "/sessions", "Generate new and unique URL (session)"
  param :img_src, String, "Direct Image URL for the session", :required => true

  def create
    session = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless Session.exists?(unique_url)
        break Session.create(uniq_hash: unique_url, img_src: params[:img_src])
      end
    end

    resp = {id: session.id, url: BASE_URL + session.uniq_hash, :img_src => session.img_src}
    respond_with(resp, :location => resp[:url])
  end

  api :DELETE, "/sessions/:id", "Destroy the URL (session)"

  def destroy
    session = Session.find(params[:id])

    respond_with(session.try(:destroy))
  end
end
