uri = URI.parse(ENV["REDISCLOUD_URL"] || "redis://localhost:6379/")
options = {:adapter  => "redis", :host => uri.host, :port => uri.port, :password => uri.password}

DataMapper.setup(:default, options)