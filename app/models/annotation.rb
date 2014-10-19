class Annotation
  include Redis::Objects
  include DataMapper::Resource

  belongs_to :session

  # datamapper fields, just used for .create
  property :id, Serial
  property :text, Text, :required => true
  property :shapes, Json, :required => true
  property :context, Text
  # property :is_deleted, Boolean, :default => false
  timestamps :at

  def self.find_id_and_session_id(id, session_id)
    annotation = self.map { |a| break a if a.id == id.to_i && a.session_id == session_id.to_i }
    annotation.is_a?(Array) ? annotation.first : annotation
  end

  def self.find_all_updates_after(time, session_id)
    annotations = self.map { |a| a if a.created_at > DateTime.strptime(time,'%s') && a.session_id == session_id.to_i }
    annotations.delete(nil)
    annotations
  end
end