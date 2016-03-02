<?php
/**
 * Created by PhpStorm.
 * User: giero
 * Date: 01.03.16
 * Time: 20:58
 */

namespace AcmeBundle\Topic;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Symfony\Bridge\Monolog\Logger;

class AcmeTopic implements TopicInterface
{

    private $toCalculate = [];
    private $calculated = [];

    public function __construct()
    {
        $this->toCalculate = range(0, 20);
    }

    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.
//        $topic->broadcast(['msg' => $connection->resourceId." has joined ".$topic->getId()]);
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.
//        $topic->broadcast(['msg' => $connection->resourceId." has left ".$topic->getId()]);
    }


    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligible
     * @return mixed|void
     */
    public function onPublish(
        ConnectionInterface $connection,
        Topic $topic,
        WampRequest $request,
        $event,
        array $exclude,
        array $eligible
    ) {
        if (is_array($event) && isset($event['input']) & isset($event['result'])) {

            $this->calculated[$event['input']] = $event['result'];

            $calculated = [];
            foreach ($this->calculated as $key => $value) {
                $calculated[] = "{$key}: {$value}";
            }

            $topic->broadcast('Calculated for: ' . join(', ', $calculated));
        }

        if (empty($this->toCalculate)) {
            $this->toCalculate = range(0, random_int(1, 20));
            $this->calculated = [];
            $topic->broadcast('NEW DATA : ' . count($this->toCalculate) . ' elements');
        }

        $input = array_rand($this->toCalculate);
        unset($this->toCalculate[$input]);
        $connection->event($topic->getId(), ['input' => $input]);
    }

    /**
     * Like RPC is will use to prefix the channel
     * @return string
     */
    public function getName()
    {
        return 'acme.topic';
    }
}
