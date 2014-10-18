class Api::V1::UrlGeneratorController < ApplicationController
  respond_to :json

  api :GET, "/url_generator/new", "Generate new and unique URL"

  def new
    unique_url = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless $redis.exists(unique_url)
        $redis.set(unique_url, {})
        break unique_url
      end
    end

    respond_with({url: BASE_URL + unique_url})
  end

  api :DELETE, "/url_generator/:unique_hash", "Destroy the URL"

  def destroy
    respond_with($redis.del(params[:id]))
  end
end
