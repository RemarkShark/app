class Api::V1::UrlGeneratorController < ApplicationController
  respond_to :json

  def new
    unique_url = loop do
      unique_url = Digest::SHA1.hexdigest([Time.now, rand].join)

      unless $redis.exists(unique_url)
        $redis.set(unique_url, {})
        break unique_url
      end
    end

    respond_with(unique_url)
  end

  def destroy
    respond_with($redis.del(params[:id]))
  end
end
