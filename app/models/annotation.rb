class Annotation
  include Redis::Objects
  include DataMapper::Resource

  belongs_to :session

  # datamapper fields, just used for .create
  property :id, Serial
  property :text, Text, :required => true
  property :shapes, Text, :required => true
  property :context, Text
  timestamps :at

  def self.find_id_and_session_id(id, session_id)
    annotation = self.map { |a| break a if a.id == id.to_i && a.session_id == session_id.to_i }
    annotation.is_a?(Array) ? annotation.first : annotation
  end
end