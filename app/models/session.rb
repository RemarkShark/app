class Session
  include Redis::Objects
  include DataMapper::Resource

  validates_uniqueness_of :uniq_hash
  has n, :annotations, constraint: :destroy

  # datamapper fields, just used for .create
  property :id, Serial
  property :uniq_hash, Text, :required => true, :index => true
  property :img_src, Text, :required => true
  timestamps :at

  def self.exists?(uniq_hash)
    session = self.map { |s| break s if s.uniq_hash == uniq_hash }
    session.is_a?(Array) ? session.first : true
  end
  
  def self.find_by_uniq_hash(uniq_hash)
    session = self.map { |s| break s if s.uniq_hash == uniq_hash }
    session.is_a?(Array) ? session.first : session
  end
  
  def self.find(id)
    session = self.map { |s| break s if s.id == id.to_i }
    session.is_a?(Array) ? session.first : session
  end

  def persisted_annotations
    annotations = []
    annotes = self.annotations

    annotes.each do |annote|
      annotations << annote unless annote.is_deleted
    end

    annotations
  end
end
