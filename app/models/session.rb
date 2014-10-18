class Session
  include Redis::Objects
  include DataMapper::Resource

  # validates_is_unique :uniq_hash
  # has n, :pictures

  # datamapper fields, just used for .create
  property :id, Serial
  property :uniq_hash, Text

  def self.exists?(uniq_hash)
    session = self.map { |s| break s if s.uniq_hash == uniq_hash }
    session.is_a?(Array) ? session.first : true
  end

  def self.find(id)
    session = self.map { |s| break s if s.id == id.to_i }
    session.is_a?(Array) ? session.first : session
  end
end
