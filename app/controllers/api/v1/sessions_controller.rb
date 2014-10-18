class Api::V1::SessionsController < ApplicationController
  respond_to :json

  api :GET, "/sessions/new", "Generate new and unique URL"

  def new
    unique_url = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless $redis.exists(unique_url)
        $redis.set(unique_url, {})
        break unique_url
      end
    end

    respond_with(BASE_URL + unique_url)
  end

  api :DELETE, "/sessions/:unique_hash", "Destroy the URL"

  def destroy
    respond_with($redis.del(params[:id]))
  end
end
